import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditorListPage } from './editor-list.page';

describe('EditorListPage', () => {
  let component: EditorListPage;
  let fixture: ComponentFixture<EditorListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
