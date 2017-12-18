const defaults = {
    aliases: [],
    groupBy: "type",
    childElement: "children",
    prefix: ""
}

const groupBy = (array, options = {}) => {
    let config = Object.assign({}, defaults, options);
    let result = [];

    array.forEach((v, i) => {
        if (v[config.childElement] && v[config.childElement].length > 0) {
            v[config.childElement] = groupBy(v[config.childElement], config);
        }

        let groupedItem = result.find(r => r[config.groupBy] === `${config.prefix}${v[config.groupBy]}`);

        let child = v;
        if (v[config.childElement] && v[config.childElement].length > 0) {
            child[config.childElement] = v[config.childElement];
        }

        if (!groupedItem) {

            let alias = v[config.groupBy];
            if (config.aliases.find(item => item.name === v[config.groupBy]) != undefined) 
                alias = config.aliases.find(item => item.name === v[config.groupBy]).alias;
            
            groupedItem = {
                name: alias,
                groupItem: true,
                [config.groupBy]: `${config.prefix}${v[config.groupBy]}`,
                [config.childElement]: []
            };
            result.push(groupedItem);
        }

        groupedItem
        [config.childElement].push(child);
    });
    return result;
};

export default groupBy;