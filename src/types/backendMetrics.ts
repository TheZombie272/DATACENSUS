export interface MetadataQuality {
  total_resources: number;
  percent_with_title: number;
  percent_with_description: number;
  percent_with_license: number;
  percent_with_contact: number;
  percent_with_schema: number;
  formats_distribution: Record<string, number>;
}

export interface ContentCoverage {
  total_resources: number;
  resources_by_year: Record<string, number>;
  top_publishers: [string, number][];
  top_categories: [string, number][];
  size_stats: {
    count: number;
    total_bytes: number;
    avg_bytes: number;
    min_bytes: number;
    max_bytes: number;
  };
}

export interface MaintenanceActivity {
  total_resources: number;
  avg_update_days: number;
  obsolete_count: number;
  obsolete_examples: string[];
}

export interface UsageEngagement {
  total_resources: number;
  total_downloads: number;
  total_accesses: number;
  top_downloaded: [string, number][];
  top_accessed: [string, number][];
}

export interface OperationalKPIs {
  total_resources: number;
  percent_open_license: number;
  percent_schema_compliance: number;
}

export interface AdvancedAnalytics {
  abc_classification_top_counts: Record<string, number>;
  abc_examples: Record<string, [string, number][]>;
  monthly_creations: Record<string, number>;
}
