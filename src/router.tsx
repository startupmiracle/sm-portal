import type { RouteObject } from 'react-router-dom'
import AppShell from './components/AppShell'
import Landing from './pages/Landing'
import OrgOverview from './pages/OrgOverview'
import ProposalsList from './pages/ProposalsList'
import ProposalDetail from './pages/ProposalDetail'
import AcademyCatalog from './pages/AcademyCatalog'
import CourseOverview from './pages/CourseOverview'
import LessonPlayer from './pages/LessonPlayer'
import Account from './pages/Account'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'account', element: <Account /> },
      { path: 'c/:org/overview', element: <OrgOverview /> },
      { path: 'c/:org/proposals', element: <ProposalsList /> },
      { path: 'c/:org/proposals/:slug', element: <ProposalDetail /> },
      { path: 'c/:org/academy', element: <AcademyCatalog /> },
      { path: 'c/:org/academy/:courseSlug', element: <CourseOverview /> },
      { path: 'c/:org/academy/:courseSlug/:moduleSlug/:lessonSlug', element: <LessonPlayer /> },
    ],
  },
]

