import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SubTaskComponent } from './subtask.component';

describe('SubtaskComponent', () => {
  let component: SubTaskComponent;
  let fixture: ComponentFixture<SubTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubTaskComponent, HttpClientModule],
      providers: [],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
