import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTranscriptionPage } from './create-transcription.page';

describe('CreateTranscriptionPage', () => {
  let component: CreateTranscriptionPage;
  let fixture: ComponentFixture<CreateTranscriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTranscriptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTranscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
