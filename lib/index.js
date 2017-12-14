export const groupBy = (array, config) => {
    let result = [];
    let aliasForGroupItem = []
    if (config.alias)
        aliasForGroupItem = config.alias;

    array.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
            v.children = groupBy(v.children, config);
        }

        let groupedItem = result.find(r => r.type === `_${v.type}`);

        let child = v;
        if (v.children && v.children.length > 0) {
            child.children = v.children;
        }

        if (!groupedItem) {

            let alias = v.type;
            if (aliasForGroupItem && aliasForGroupItem.find(item => item.name === v.type) != undefined)
                alias = aliasForGroupItem.find(item => item.name === v.type).alias;

            groupedItem = {
                name: alias,
                type: `_${v.type}`,
                children: []
            };
            result.push(groupedItem);
        }

        groupedItem
            .children
            .push(child);
    });
    return result;
};