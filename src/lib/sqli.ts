// http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
// https://owasp.org/www-community/attacks/SQL_Injection

export default function (value) {

    if (value === null || value === undefined) {
        return false;
    }

    // SQL Meta
    if (new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'i').test(value)) {
        return true;
    }

    // SQL Meta 2
    if (new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i').test(value)) {
        return true;
    }

    // SQL typical
    if (new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i').test(value)) {
        return true;
    }

    // SQL union
    if (new RegExp('((%27)|(\'))union', 'i').test(value)) {
        return true;
    }

    // MS SQL
    if (new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i').test(value)) {
        return true;
    }

    return false;
}