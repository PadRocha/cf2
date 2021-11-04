import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePDFComponent } from './create-pdf.component';

describe('CreatePDFComponent', () => {
  let component: CreatePDFComponent;
  let fixture: ComponentFixture<CreatePDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
