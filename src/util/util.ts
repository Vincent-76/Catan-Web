
export function pBGColorClass( color:string ):string {
    switch ( color ) {
        case "Green": return "pBGColorGreen";
        case "Blue": return "pBGColorBlue";
        case "Yellow": return "pBGColorYellow";
        case "Red": return "pBGColorRed";
    }
    return "";
}