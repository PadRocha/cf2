import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideLinesComponent } from './aside-lines.component';

describe('AsideLinesComponent', () => {
  let component: AsideLinesComponent;
  let fixture: ComponentFixture<AsideLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideLinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
