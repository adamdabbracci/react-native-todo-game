
import { RRule, RRuleSet, rrulestr } from 'rrule';

export default class RRuleService {

    RRule = RRule;

    // https://github.com/jakubroztocil/rrule
    buildRRuleString = (frequency, interval) => {
        const rule = new RRule({
          freq: frequency,
          interval,
        });

        return rule.toString();
      }
}