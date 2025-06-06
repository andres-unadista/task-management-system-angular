import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TaskComponent } from './task.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaskComponent, HttpClientModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id_project: '123' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
