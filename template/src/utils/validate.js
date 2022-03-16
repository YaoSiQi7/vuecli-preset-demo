/*
 * @Author: your name
 * @Date: 2020-11-24 10:07:18
 * @LastEditTime: 2021-01-21 17:15:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\utils\validate.js
 */
export const BASE_NAME = /^[\u4e00-\u9fa5a-zA-Z_\d]+$/;

export const BASE_VALUE = /^[a-zA-Z_\d]+$/;

export const BASE_LENGTH = 50;

export const BASE_LENGTH_TEXT = '最大50个字符';

export const BASE_NAME_TEXT = '包含中文、英文字母（大小写）、英文下划线，数字，及其组合';

export const BASE_VALUE_TEXT = '包含英文字母（大小写）、英文下划线，数字，及其组合';

export const NO_EMPTY_STRING = '不能为空';

export const NO_EMPTY_SPACE_ALLOWED = '不能为空或只有空格';

export const NO_SCENE_NO = '交易场景标识不能为空';

export const NAME_NOT_NULL = (str) => `${str}不能为空`;

export const MAX_INPUT_LENGTH = (maxLength) => `最多输入${maxLength}个字符`;

export const BASE_AMOUNT_VALUE = /^(?!0+$)(?!0*\.0*$)\d{1,13}(\.\d{1,2})?$/;

export const BASE_AMOUNT_NAME = '金额必须为数字且大于0,且整数部分最多13位,小数部分最多两位';

export const NO_SELECT_VALUE = (str) => `请选择${str}`;

export const NO_TRANSFER_VALUE = /^\s*$/;

export const NO_SPACE_RISK = /^[^\s]+$/; // 匹配除空格以外的任意字符

export const NO_SPACE_TEXT = '包括除空格、enter换行以外的任意字符，及其组合';

export const BASE_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const BASE_EMAIL_TEXT = '请输入正确的邮箱地址';

export const BASE_IP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

export const BASE_IP_TEXT = '请输入正确的IP地址';

export const BASE_PHONE = /^1[3456789]\d{9}$/;

export const BASE_PHONE_TEST = '请输入正确的手机号码';

export const ID_CARD = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/; // 校验身份证号码格式

export const ID_CARD_TEXT = '请输入正确的身份证号码';
