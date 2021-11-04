export interface SharedFolder {
    id: number;
    name: string;
    owner: number;
    path: string;
    texts: SharedFolderText[];
}

interface SharedFolderText {
    id: number;
    title: string;
}
