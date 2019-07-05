import pick from 'lodash/pick';
import { ILang } from 'app/shared/model/language.interface';
import { TranslatorContext } from 'react-jhipster';

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with relationship fields with empty an empty id and thus
 * resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = entity => {
  const keysToKeep = Object.keys(entity).filter(k => !(entity[k] instanceof Object) || (entity[k]['id'] !== '' && entity[k]['id'] !== -1));

  return pick(entity, keysToKeep);
};

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<any>) =>
  idList.filter((entityId: any) => entityId !== '').map((entityId: any) => ({ id: entityId }));

/**
 * Gets the translation of the given localized entity field based on the current locale
 */
export const translateEntityField = (entityField: ILang) => {
  const currentLocale = TranslatorContext.context.locale || TranslatorContext.context.defaultLocale;
  return entityField[currentLocale];
};

/**
 * Return the proper image according to the currentLocale
 */
export const localeImage = () => {
  const currentLocale = TranslatorContext.context.locale || TranslatorContext.context.defaultLocale;
  return currentLocale === 'el' ? '/content/images/Assets/espa-el.png' : '/content/images/Assets/espa-en.png';
};
