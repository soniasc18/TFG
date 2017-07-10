import i18n from 'i18next';

export const languages =
 [{ value:"af", label: "Afrikanns"},
  { value:"sq", label: "Albanian"},
  { value:"ar", label: "Arabic"},
  { value:"hy", label: "Armenian"},
  { value:"eu", label: "Basque"},
  { value:"bn", label: "Bengali"},
  { value:"bg", label: "Bulgarian"},
  { value:"ca", label: "Catalan"},
  { value:"km", label: "Cambodian"},
  { value:"zh", label: "Chinese (Mandarin)"},
  { value:"hr", label: "Croation"},
  { value:"cs", label: "Czech"},
  { value:"da", label: "Danish"},
  { value:"nl", label: "Dutch"},
  { value:"en", label: "English"},
  { value:"et", label: "Estonian"},
  { value:"fj", label: "Fiji"},
  { value:"fi", label: "Finnish"},
  { value:"fr", label: "French"},
  { value:"ka", label: "Georgian"},
  { value:"de", label: "German"},
  { value:"el", label: "Greek"},
  { value:"gu", label: "Gujarati"},
  { value:"he", label: "Hebrew"},
  { value:"hi", label: "Hindi"},
  { value:"hu", label: "Hungarian"},
  { value:"is", label: "Icelandic"},
  { value:"id", label: "Indonesian"},
  { value:"ga", label: "Irish"},
  { value:"it", label: "Italian"},
  { value:"ja", label: "Japanese"},
  { value:"jw", label: "Javanese"},
  { value:"ko", label: "Korean"},
  { value:"la", label: "Latin"},
  { value:"lv", label: "Latvian"},
  { value:"lt", label: "Lithuanian"},
  { value:"mk", label: "Macedonian"},
  { value:"ms", label: "Malay"},
  { value:"ml", label: "Malayalam"},
  { value:"mt", label: "Maltese"},
  { value:"mi", label: "Maori"},
  { value:"mr", label: "Marathi"},
  { value:"mn", label: "Mongolian"},
  { value:"ne", label: "Nepali"},
  { value:"no", label: "Norwegian"},
  { value:"fa", label: "Persian"},
  { value:"pl", label: "Polish"},
  { value:"pt", label: "Portuguese"},
  { value:"pa", label: "Punjabi"},
  { value:"qu", label: "Quechua"},
  { value:"ro", label: "Romanian"},
  { value:"ru", label: "Russian"},
  { value:"sm", label: "Samoan"},
  { value:"sr", label: "Serbian"},
  { value:"sk", label: "Slovak"},
  { value:"sl", label: "Slovenian"},
  { value:"es", label: "Spanish"},
  { value:"sw", label: "Swahili"},
  { value:"sv", label: "Swedish "},
  { value:"ta", label: "Tamil"},
  { value:"tt", label: "Tatar"},
  { value:"te", label: "Telugu"},
  { value:"th", label: "Thai"},
  { value:"bo", label: "Tibetan"},
  { value:"to", label: "Tonga"},
  { value:"tr", label: "Turkish"},
  { value:"uk", label: "Ukranian"},
  { value:"ur", label: "Urdu"},
  { value:"uz", label: "Uzbek"},
  { value:"vi", label: "Vietnamese"},
  { value:"cy", label: "Welsh"},
  { value:"xh", label: "Xhosa"}];

export function suggestions() {
  return [i18n.t("global_config.keylist.Art"),
          i18n.t("global_config.keylist.Biology"),
          i18n.t("global_config.keylist.Chemistry"),
          i18n.t("global_config.keylist.Citizenship"),
          i18n.t("global_config.keylist.Computerscience"),
          i18n.t("global_config.keylist.Economics"),
          i18n.t("global_config.keylist.Education"),
          i18n.t("global_config.keylist.Engineering"),
          i18n.t("global_config.keylist.Foreignlanguages"),
          i18n.t("global_config.keylist.Generalculture"),
          i18n.t("global_config.keylist.Geography"),
          i18n.t("global_config.keylist.Geology"),
          i18n.t("global_config.keylist.History"),
          i18n.t("global_config.keylist.Humanities"),
          i18n.t("global_config.keylist.Literature"),
          i18n.t("global_config.keylist.Maths"),
          i18n.t("global_config.keylist.Music"),
          i18n.t("global_config.keylist.Naturalscience"),
          i18n.t("global_config.keylist.Physics"),
          i18n.t("global_config.keylist.Technology")];
}

export function statusOptions() {
  return [{label: i18n.t("global_config.status_list.draft"),       value: 'draft'}, 
          {label: i18n.t("global_config.status_list.final"),       value: 'final'}, 
          {label: i18n.t("global_config.status_list.revised"),     value: 'revised'}, 
          {label: i18n.t("global_config.status_list.unavailable"), value: 'unavailable'}];
}  

export function contextOptions() {
  return [{label: i18n.t("global_config.context_list.school"), value: 'school'},
          {label: i18n.t("global_config.context_list.high_education"), value: 'higher education'},
          {label: i18n.t("global_config.context_list.training"), value: 'training'},
          {label: i18n.t("global_config.context_list.other"), value: 'other'}];
}
export const difLevels = ['very easy', 'easy', 'medium', 'difficult', 'very difficult'];

export const rightLevels = [{value: "Public Domain", label: "Public Domain"},
                            {value: "CreativeCommons BY", label: "CreativeCommons BY"},
                            {value: "CreativeCommons BY-SA", label: "CreativeCommons BY-SA"},
                            {value: "CreativeCommons BY-ND", label: "CreativeCommons BY-ND"},
                            {value: "CreativeCommons BY-NC", label: "CreativeCommons BY-NC"},
                            {value: "CreativeCommons BY-NC-SA", label: "CreativeCommons BY-NC-SA"},
                            {value: "CreativeCommons BY-NC-ND", label: "CreativeCommons BY-NC-ND"}];

