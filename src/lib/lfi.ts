// https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion
// https://book.hacktricks.xyz/pentesting-web/file-inclusion

const commonInclusions = [
    'etc/',
    'apache/',
    'httpd/',
    '.log',
    '.ini',
    '.bat',
    '.htaccess',
    './'
];

export default function (value) {

    if (value === null || value === undefined) {
        return false;
    }

    const isIncluded = commonInclusions.some(inclusion => value.includes(inclusion));
    return isIncluded;
}