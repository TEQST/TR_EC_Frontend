import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TranscriptionDetailPage } from './transcription-detail.page';

describe('TranscriptionDetailPage', () => {
  let component: TranscriptionDetailPage;
  let fixture: ComponentFixture<TranscriptionDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptionDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
