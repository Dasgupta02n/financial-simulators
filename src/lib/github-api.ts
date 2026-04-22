import { Octokit } from "octokit";

function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN ?? "";
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return new Octokit({ auth: token });
}

function getRepoInfo() {
  return {
    owner: process.env.GITHUB_REPO_OWNER ?? "",
    repo: process.env.GITHUB_REPO_NAME ?? "",
    branch: process.env.GITHUB_BRANCH ?? "main",
  };
}

export async function getFileContent(path: string): Promise<{
  content: string;
  sha: string;
} | null> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if ("content" in response.data && "sha" in response.data) {
      const content = Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");
      return { content, sha: response.data.sha };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      branch,
    });
    return true;
  } catch (error) {
    console.error("Failed to create file:", error);
    return false;
  }
}

export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<boolean> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch,
    });
    return true;
  } catch (error) {
    console.error("Failed to update file:", error);
    return false;
  }
}

export async function saveFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  const existing = await getFileContent(path);
  if (existing) {
    return updateFile(path, content, message, existing.sha);
  }
  return createFile(path, content, message);
}