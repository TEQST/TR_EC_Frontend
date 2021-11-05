import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const textId = parseInt(this.route.snapshot.paramMap.get('textId'), 10);
    console.log(textId);
  }

}
