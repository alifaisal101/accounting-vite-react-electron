export const isValidWindowsPath = (path:string) => {
    if((path.charAt(0) != "\\" || path.charAt(1) != "\\") || (path.charAt(0) != "/" || path.charAt(1) != "/"))
    {
       if(!path.charAt(0).match(/^[a-zA-Z]/))  
       {
            return false;
       }
       if(!path.charAt(1).match(/^[:]/) || !path.charAt(2).match(/^[\/\\]/))
       {
           return false;
       } 
    }
    return true;
}

export const isValidLinuxPath = (path:string) => {
    // Regular expression to match a valid Linux file path
    const linuxPathRegex = /^\/(?:[^\/\0:\*\?"<>\|\r\n]+\/)*[^\/\0:\*\?"<>\|\r\n]*$/;

    // Test the path against the regular expression
    return linuxPathRegex.test(path);
}