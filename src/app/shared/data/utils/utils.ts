export class Utils {
    
    createPattern(pattern: string, rule = /[x]/g, replace = 'x', onlyNumbers = true) {
        return pattern.replace(rule, (c) => {
            var r = (Math.random() * 10) | 0,
                v = c == replace ? r : (r & 0x3) | 0x8;
            return onlyNumbers ? v.toString(10) : v.toString(16);
        });
    }
}