import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ManageFolderService } from 'src/app/services/manage-folder.service';

// interface to handle the user objects better
interface User {
  'id': number;
  'username': string;};

@Component({
  selector: 'app-share-folder',
  templateUrl: './share-folder.page.html',
  styleUrls: ['./share-folder.page.scss'],
})
export class ShareFolderPage implements OnInit {

  @Input() folderId: number;
  @Input() folderName: string;

  public filteredUsers: User[];
  public filteredEditors: User[];
  private editors: User[];
  private allUsers: User[];
  private searchTerm = '';

  constructor(
    public viewCtrl: ModalController,
    private folderService: ManageFolderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // reset Search term on each opening of the modal
    this.searchTerm = '';
    this.fetchUserLists();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async fetchUserLists() {
    // get a list of all users
    await this.folderService.getAllUsers()
        .toPromise()
        .then((userArray) => {
          this.allUsers = userArray;
          this.filteredUsers = userArray;
        });
    // get a list of all speakers of the folder
    await this.folderService.getEditors(this.folderId)
        .toPromise()
        .then((sharedFolder) => {
          this.editors = sharedFolder['editors'];
          this.filteredEditors = sharedFolder['editors'];
        });
    this.filterLists();
  }

  // update the search term on text input
  onSearchTerm(event: CustomEvent) {
    this.searchTerm = event.detail.value;
    this.filterLists();
  }

  // filter user and speaker list based on the search term
  filterLists() {
    this.filteredEditors = this.editors.filter((editor) => editor.username.toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()));

    this.filteredUsers = this.allUsers.filter((user) => {
      if (user.username.toLowerCase()
          .startsWith(this.searchTerm.toLowerCase())) {
        // remove all users already listed in the speaker list
        return this.filteredEditors
            .findIndex((editor) => editor.username === user.username) === -1;
      }
      return false;
    });
  }

  async addEditor(user: User) {
    // create a new array with just the speaker ids
    const newEditors = this.editors.map((editor) => editor.id);
    newEditors.push(user.id);
    await this.folderService.setEditors(
        this.folderId,
        newEditors)
        .toPromise()
        .then((sharedfolder) => this.editors = sharedfolder['editors']);
    this.filterLists();
  }

  async removeEditor(user: User) {
    const oldEditorIds = this.editors.map((editor) => editor.id);
    // remove the speaker from the array
    const newEditorIds = oldEditorIds.filter(
        (editorId) => editorId != user.id);
    await this.folderService.setEditors(
        this.folderId,
        newEditorIds)
        .toPromise()
        .then((sharedfolder) => this.editors = sharedfolder['editors']);
    this.filterLists();
  }

}
