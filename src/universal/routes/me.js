import makeReducer from 'universal/redux/makeReducer';
import {resolvePromiseMap} from 'universal/utils/promises';

const setSettingsImports = () =>
  new Map([
    ['component', System.import(
      'universal/modules/userDashboard/containers/MeSettings/MeSettings')],
    ['userDashboardSettings', System.import(
      'universal/modules/userDashboard/ducks/settingsDuck')]
  ]);

const getSettingsImports = importMap => ({
  component: importMap.get('component'),
  userDashboardSettings: importMap.get('userDashboardSettings').default
});

export default function userDashboardRoutes(store) {
  return [
    {
      path: 'me',
      getComponent: async (location, cb) => {
        const component = await System.import('universal/modules/userDashboard/containers/Me/Me');
        cb(null, component);
      },
    },
    {
      path: '/me/settings',
      getComponent: async (location, cb) => {
        const promiseMap = setSettingsImports();
        const importMap = await resolvePromiseMap(promiseMap);
        const {component, ...asyncReducers} = getSettingsImports(importMap);
        const newReducer = makeReducer(asyncReducers);
        store.replaceReducer(newReducer);
        cb(null, component);
      },
    }
  ];
}
