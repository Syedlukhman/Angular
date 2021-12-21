import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccefullComponent } from './succefull.component';

describe('SuccefullComponent', () => {
  let component: SuccefullComponent;
  let fixture: ComponentFixture<SuccefullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccefullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccefullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
