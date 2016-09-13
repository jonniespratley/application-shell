import Controller from './Controller';
import NavDrawerView from './../view/NavDrawerView';

export default class StaticPageController extends Controller {

  constructor() {
    super();

    var navDrawer = new NavDrawerView();

    var sideNavToggleButton = document.querySelector('.js-toggle-menu');
    sideNavToggleButton.addEventListener('click', () => {
      navDrawer.toggle();
    });
  }
}
