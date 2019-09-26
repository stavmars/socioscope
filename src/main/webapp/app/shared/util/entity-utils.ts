import pick from 'lodash/pick';
import { ILang } from 'app/shared/model/language.interface';
import { TranslatorContext } from 'react-jhipster';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import _ from 'lodash';

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
  return entityField && entityField[currentLocale];
};

/**
 * Unflatten list of dimension codes based on parentId property and fill level field. Used to create tree view of hierarchical codelists
 */
export const unflattenDimensionCodes = (codes: IDimensionCode[]) => {
  codes = _.sortBy(codes, 'order', code => translateEntityField(code.name)) as IDimensionCode[];
  const childrenByParent = _.groupBy(codes, 'parentId');
  const unflattenedCodes = _.filter(codes, code => {
    code.children = childrenByParent[code.notation];
    return !code.parentId;
  });
  const fillLevel = (code, level) => {
    code.level = level;
    code.children && code.children.forEach(child => fillLevel(child, level + 1));
  };
  unflattenedCodes.forEach(code => fillLevel(code, 0));
  return unflattenedCodes;
};

/**
 * Return the proper image according to the currentLocale
 */
export const localeImage = () => {
  const currentLocale = TranslatorContext.context.locale || TranslatorContext.context.defaultLocale;
  return currentLocale === 'el' ? '/content/images/Assets/espa-el.png' : '/content/images/Assets/espa-en.png';
};
