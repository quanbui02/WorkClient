import { CoursesComponent } from './Courses/Courses.component';
import { QuestionLessionsComponent } from './questionLessions/questionLessions.component';
import { LessonRatesComponent } from './lessonRates/lessonRates.component';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../lib-shared/auth/guard.service';
import { LessonsComponent } from './lessons/lessons.component';

const routes: Routes = [
    {
        path: 'lessons',
        canActivate: [GuardService],
        component: LessonsComponent
    },
    {
        path: 'lessons-rate',
        canActivate: [GuardService],
        component: LessonRatesComponent
    },
    {
        path: 'questions-lesson',
        canActivate: [GuardService],
        component: QuestionLessionsComponent
    },
    {
        path: 'courses',
        canActivate: [GuardService],
        component: CoursesComponent
    }
];

export const DaoTaoRoutes = RouterModule.forChild(routes);
