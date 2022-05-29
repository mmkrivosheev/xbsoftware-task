import TagsWidget from "./components/TagsWidget/TagsWidget";
import "./index.css";

const tagsWidget = new TagsWidget("tags-widget");
tagsWidget.renderWidget();

// console.log(tagsWidget.tagsCollection);
// tagsWidget.tagsCollection = ["Один", "Два", "Три"];
// tagsWidget.setIsReadOnly(true);
// tagsWidget.addOneTag("Четыре");
// tagsWidget.deleteOneTag(вставьте id тега);