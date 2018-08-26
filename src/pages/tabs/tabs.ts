import { Component } from '@angular/core';

import { AddScreen } from '../add/add';
import { ListScreen } from '../list/list';
import { CalendarScreen } from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  constructor() {

  }
}
