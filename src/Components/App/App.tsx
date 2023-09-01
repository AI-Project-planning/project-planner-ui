import './App.css';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar'
import Menu from '../Menu/Menu';
import HomePage from '../HomePage/HomePage';
import SavedPage from '../SavedPage/SavedPage';
import logo from '../../images/logo.png';
import { Project } from '../../Types/types';
import Results from '../Results/Results';
import { apiCall } from '../../apiCalls';
import FormPage from '../FormPage/FormPage';
import { FormData } from '../../Types/FormPageTypes';
import SingleProject from '../SingleProject/SingleProject';
import Empty from '../Empty/Empty';
import Tutorial from '../Tutorial/Tutorial';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [appError, setAppError] = useState<Error | null>(null)
  const [requestNeeded, setRequestNeeded] = useState(false);
  const [currentResult, setCurrentResult] = useState<null | Project>(null);
  const [userFormData, setUserFormData] = useState<null | FormData>(null);

  const location = useLocation().pathname
  const changeScreenSize = () => window.innerWidth < 1170 ? setSmallScreen(true) : setSmallScreen(false);
  const openOrCloseMenu = () => setMenuOpen(prev => !prev);
  const getAllProjects: () => Promise<Project[]> = apiCall(1, 'projects', {});
  const updateSavedProjects = (projects: Project[]) => setSavedProjects(projects.filter(project => project.attributes.saved));
  const requestAllProjects = () => setRequestNeeded(prev => !prev)

  useEffect(() => {
    const apiRequest = async () => {
      try {
        setAllProjects(await getAllProjects())
      } catch (error) {
        if (error instanceof Error) setAppError(error)
      }
    }

    apiRequest()

    return () => setAppError(null)
  }, [requestNeeded])

  const updateCurrentResult = (result: Project) => {
    setCurrentResult(result)
  }

  const updateFormData = (formData: FormData) => {
    setUserFormData(formData)
  }

  useEffect(() => {
    changeScreenSize()
    window.addEventListener('resize', changeScreenSize)

    return () => window.removeEventListener('resize', changeScreenSize)
  }, []);

  useEffect(() => {
    const ombreBackLocaion = location === '/' || location === '/form'
    ombreBackLocaion && !menuOpen && smallScreen
      ? document.querySelector('body')?.classList.add('ombre')
      : document.querySelector('body')?.classList.remove('ombre')
  }, [smallScreen, menuOpen, location])

  

  return (
    <div className='app'>
      {menuOpen ? <Menu openOrCloseMenu={openOrCloseMenu} /> :
        <>
          <header className='app-header'>
            <Link className='app-logo' to='/'><img src={logo} alt='project planner ai generator logo and home page button'/></Link>
            <NavBar smallScreen={smallScreen} openOrCloseMenu={openOrCloseMenu} />
          </header>
          <main className={location === '/form' ? 'form-height' : ''}>
            {appError && <p className='app-error'>An error occured, please try again later!</p>}
            <Routes>
              <Route path='/' element={<HomePage smallScreen={smallScreen} />} />
              <Route path='/tutorial' element={<Tutorial />}/>
              <Route path='/form' element={<FormPage setAppError={setAppError} updateCurrentResult={ updateCurrentResult} updateFormData={updateFormData}/>} />
              <Route path='/results' element={currentResult ? <Results currentResult={currentResult} updateCurrentResult={updateCurrentResult} formData={userFormData} requestAllProjects={requestAllProjects} setAppError={setAppError}/> : <div>no results here</div>} />
              <Route path='/saved' element={<SavedPage allProjects={allProjects} savedProjects={savedProjects} updateSavedProjects={updateSavedProjects} />} />
              <Route path='/saved/:projectID' element={<SingleProject allProjects={allProjects} requestAllProjects={requestAllProjects} setAppError={setAppError} />} />
              {['*', '/form/*', '/results/*'].map(path => <Route key={path} path={path} element={<Empty />} />)}
            </Routes>
          </main>
        </>
      }
    </div>
  );
}

export default App;
