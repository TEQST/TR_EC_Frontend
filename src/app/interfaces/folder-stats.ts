
export interface FolderStats {
    id: number;
    name: string;
    editors: StatsPerEditor[];
}

// sub interfaces for cleaner formatting
export interface StatsPerEditor {
    name: string;
    finished: number;
}
