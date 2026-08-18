import { Meilisearch, type Meilisearch as MeilisearchClient } from "meilisearch";
import { getSearchIndexName } from "./config";

let client: MeilisearchClient | null = null;

function getHost(): string {
  const host = process.env.MEILISEARCH_HOST;
  if (!host) throw new Error("MEILISEARCH_HOST is not set");
  return host.replace(/\/+$/, "");
}

function getApiKey(): string | undefined {
  return (
    process.env.MEILISEARCH_ADMIN_API_KEY ??
    process.env.MEILISEARCH_SEARCH_API_KEY ??
    undefined
  );
}

export function getMeilisearchClient(): MeilisearchClient {
  if (client) return client;
  client = new Meilisearch({ host: getHost(), apiKey: getApiKey() });
  return client;
}

export function getIndexUid(): string {
  return getSearchIndexName();
}
