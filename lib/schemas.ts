export interface FieldSchema {
  type: string
  required?: boolean
  enum?: string[]
}

export interface CollectionSchema {
  [fieldName: string]: FieldSchema
}

export const COLLECTION_SCHEMAS: Record<string, CollectionSchema> = {
  clients: {
    client_name: { type: "string", required: true },
    overall_status: {
      type: "string",
      enum: ["active", "disabled"],
      required: true,
    },
    plan: {
      type: "string",
      enum: ["Basic", "Premium", "VIP"],
      required: true,
    },
    priority: {
      type: "string",
      enum: ["Low", "Medium", "High", "Highest", "Unconfirmed"],
      required: true,
    },
    customer: { type: "string", required: true },
    agency: { type: "string", required: true },
    onboarding: {
      type: "string",
      enum: ["Complete", "Incomplete"],
      required: true,
    },
    channel_id: { type: "string" },
    channel_name: { type: "string" },
    initial_search_status: { type: "string" },
    gender: { type: "string" },
    username: { type: "string" },
    created_by: { type: "string", required: true },
    created: { type: "date" },
    last_modified: { type: "date" },
    search_status: { type: "object" },
    social_media_links: { type: "object" },
    search_terms: { type: "object", required: true },
    channel_details: { type: "object" },
    _id: { type: "objectId" },
  },
  google_findings: {
    client_id: { type: "objectId", required: true },
    url: { type: "string", required: true },
    title: { type: "string" },
    description: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "reviewed", "takedown_requested", "removed"],
    },
    priority: {
      type: "string",
      enum: ["Low", "Medium", "High", "Critical"],
    },
    created: { type: "date" },
    last_modified: { type: "date" },
    _id: { type: "objectId" },
  },
  colab_links: {
    client_id: { type: "objectId", required: true },
    url: { type: "string", required: true },
    title: { type: "string" },
    status: { type: "string", enum: ["active", "inactive", "removed"] },
    created: { type: "date" },
    last_modified: { type: "date" },
    _id: { type: "objectId" },
  },
  colab_updates: {
    link_all_id: { type: "objectId", required: true },
    update_type: {
      type: "string",
      enum: ["content_change", "status_change", "removal"],
    },
    description: { type: "string" },
    created: { type: "date" },
    _id: { type: "objectId" },
  },
  twitter_findings: {
    client_id: { type: "objectId", required: true },
    tweet_id: { type: "string", required: true },
    tweet_url: { type: "string", required: true },
    content: { type: "string" },
    author: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "reviewed", "takedown_requested", "removed"],
    },
    created: { type: "date" },
    last_modified: { type: "date" },
    _id: { type: "objectId" },
  },
  reddit_data: {
    client_id: { type: "objectId", required: true },
    post_id: { type: "string", required: true },
    post_url: { type: "string", required: true },
    title: { type: "string" },
    content: { type: "string" },
    subreddit: { type: "string" },
    author: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "reviewed", "takedown_requested", "removed"],
    },
    created: { type: "date" },
    last_modified: { type: "date" },
    _id: { type: "objectId" },
  },
  excluded_domains: {
    domain: { type: "string", required: true },
    reason: { type: "string" },
    created: { type: "date" },
    _id: { type: "objectId" },
  },
  included_domains: {
    domain: { type: "string", required: true },
    priority: { type: "string", enum: ["Low", "Medium", "High"] },
    created: { type: "date" },
    _id: { type: "objectId" },
  },
  rejected_google_domains: {
    domain: { type: "string", required: true },
    rejection_reason: { type: "string" },
    created: { type: "date" },
    _id: { type: "objectId" },
  },
  delisted_google_domains: {
    domain: { type: "string", required: true },
    delisted_date: { type: "date" },
    created: { type: "date" },
    _id: { type: "objectId" },
  },
}

