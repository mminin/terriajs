const StandardCssColors = {
    // Colors are from Kelly's 1965 paper 'Twenty-two colors of maximum contrast'
    // http://www.iscc.org/pdf/PC54_1724_001.pdf
    // Converted from the NBS/ISCC Color System using http://tx4.us/nbs-iscc.htm
    // - with black removed (it was the second color).
    highContrast: [
        "#F2F3F4",
        "#FFB300",
        "#803E75",
        "#FF6800",
        "#A6BDD7",
        "#C10020",
        "#CEA262",
        "#817066",
        "#007D34",
        "#F6768E",
        "#00538A",
        "#FF7A5C",
        "#53377A",
        "#FF8E00",
        "#B32851",
        "#F4C800",
        "#7F180D",
        "#93AA00",
        "#593315",
        "#F13A13",
        "#232C16" // d.OlG 126 Dark Olive Green
    ],
    // From ColorBrewer2.org, 9-class Set1 (ie. qualitative).
    brewer9ClassSet1: [
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999"
    ],
    // From ColorBrewer2.org, 8-class Set2 (ie. qualitative), with brown replaced with red.
    modifiedBrewer8ClassSet2: [
        "#66c2a5",
        "#fc8d62",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#ffd92f",
        // '#e5c494',  // brown, too close to yellow to distinguish easily.
        "#f44a4c",
        "#b3b3b3"
    ]
};
export default StandardCssColors;
//# sourceMappingURL=StandardCssColors.js.map