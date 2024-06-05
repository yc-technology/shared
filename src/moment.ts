import moment from 'moment'
import 'moment-timezone'

export function londonMoment(inp?: moment.MomentInput, strict?: boolean): moment.Moment
export function londonMoment(
  inp?: moment.MomentInput,
  format?: moment.MomentFormatSpecification,
  strict?: boolean
): moment.Moment
export function londonMoment(
  inp?: moment.MomentInput,
  format?: moment.MomentFormatSpecification,
  language?: string,
  strict?: boolean
): moment.Moment
// Implementation
export function londonMoment(
  inp?: moment.MomentInput,
  formatOrStrict?: moment.MomentFormatSpecification | string | boolean,
  languageOrStrict?: string | boolean,
  maybeStrict?: boolean
): moment.Moment {
  moment.tz.setDefault('Europe/London')
  return moment(inp, formatOrStrict as string, languageOrStrict as string, maybeStrict as boolean)
}

export function utcMoment(inp?: moment.MomentInput, strict?: boolean): moment.Moment
export function utcMoment(
  inp?: moment.MomentInput,
  format?: moment.MomentFormatSpecification,
  strict?: boolean
): moment.Moment
export function utcMoment(
  inp?: moment.MomentInput,
  format?: moment.MomentFormatSpecification,
  language?: string,
  strict?: boolean
): moment.Moment
// Implementation
export function utcMoment(
  inp?: moment.MomentInput,
  formatOrStrict?: moment.MomentFormatSpecification | string | boolean,
  languageOrStrict?: string | boolean,
  maybeStrict?: boolean
): moment.Moment {
  moment.tz.setDefault('Etc/UTC')
  return moment(inp, formatOrStrict as string, languageOrStrict as string, maybeStrict as boolean)
}

export default moment
