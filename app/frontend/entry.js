import CookiesWarning             from './application/cookies_warning.component';
import EmailNotificationsReminder from './application/email_notifications_reminder.component';
import RichEditor                 from './application/rich_editor.component';
import SocialShareButtons         from './application/social_share_buttons.component';
import AutocompleteInputAddress   from './location/autocomplete_input_address.component';
import CategoryPicker             from './categories/category_picker.component';
import DebateInfoBox              from './debates/debate_info_box.component';

import StaticMap                  from './location/static_map.component';
import MeetingsApp                from './meetings/meetings_app.component';
import MeetingsMap                from './meetings/meetings_map.component';

import ProposalsApp               from './proposals/proposals_app.component';
import ProposalApp                from './proposals/proposal_app.component';
import ProposalsSelector          from './proposals/proposals_selector.component';

import ActionPlansApp             from './action_plans/action_plans_app.component';
import ActionPlanApp              from './action_plans/action_plan_app.component';

import DebateApp                  from './debates/debate_app.component';

window.CookiesWarning             = CookiesWarning;
window.EmailNotificationsReminder = EmailNotificationsReminder;
window.RichEditor                 = RichEditor;
window.SocialShareButtons         = SocialShareButtons;
window.AutocompleteInputAddress   = AutocompleteInputAddress;
window.CategoryPicker             = CategoryPicker;
window.DebateInfoBox              = DebateInfoBox;

window.StaticMap                  = StaticMap;
window.MeetingsApp                = MeetingsApp;
window.MeetingsMap                = MeetingsMap;

window.ProposalsApp               = ProposalsApp;
window.ProposalApp                = ProposalApp;
window.ProposalsSelector          = ProposalsSelector;

window.ActionPlansApp             = ActionPlansApp;
window.ActionPlanApp              = ActionPlanApp;

window.DebateApp                  = DebateApp;

require('quill/dist/quill.snow');
