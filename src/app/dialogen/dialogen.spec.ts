import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialogen } from './dialogen';

describe('Dialogen', () => {
  let component: Dialogen;
  let fixture: ComponentFixture<Dialogen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialogen],
    }).compileComponents();

    fixture = TestBed.createComponent(Dialogen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
