import { ManageFolderService } from '../services/manage-folder.service';

export class Transcription {
  static folderService: ManageFolderService;

  id: string;
  title: string;

  static setServiceProvider(folderService) {
    this.folderService = folderService;
  }

  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  delete() {
    return Transcription.folderService.deleteTranscription(this.id);
  }
}
