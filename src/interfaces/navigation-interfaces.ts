/**
 * This interfaces represents the building blocks of a navigation link where the key stands
 * for the key to the translated text that will be displayed and the link is the URL that will be
 * called when the user clicks on the link
 */
export interface NavigationItem {
    i18nKey: string,
    link: string
}