/**
 * This interfaces represents the building blocks of a navigation link where the key stands
 * for the key to the translated text that will be displayed and the link is the URL that will be
 * called when the user clicks on the link
 */
export interface NavigationItem {
    i18nKey: string,
    link: string
}

/**
 * This element represents the most basic for of item and is meant to be reused for
 * different purposes, like in example to display the next dates in the calendar
 */
export interface BasicItem {
    id: string,
    key: string,
    value: string
}

/**
 * This interface is used in the contact request where a mail will be sent to the
 * owner of the application
 */
export interface ContactRequest {
    name: string,
    email: string,
    comments: string
}

/**
 * This enum is responsible for informing its user about the status of an operation.
 * It is typically used when a Form is sent to a backend so we can keep track of the
 * status of, well... the operation
 */
export enum OPERATION_STATUS {
    IDLE,
    INITIALIZED,
    SUCCESS,
    FAILURE
}