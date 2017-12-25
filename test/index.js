import groupBy from '../src/index'

let chai = require('chai'),
    path = require('path'),
    data = [
        {
            name: "Test 1",
            type: "group-1",
            children: [
                {
                    name: "Test 5",
                    type: "group-1"
                }, {
                    name: "Test 6",
                    type: "group-2"
                }, {
                    name: "Test 7",
                    type: "group-2"
                }
            ]
        }, {
            name: "Test 2",
            type: "group-1",
            children: [
                {
                    name: "Test 8",
                    type: "group-3"
                }, {
                    name: "Test 9",
                    type: "group-3"
                }, {
                    name: "Test 10",
                    type: "group-2"
                }
            ]
        }, {
            name: "Test 3",
            type: "group-1",
            children: [
                {
                    name: "Test 10",
                    type: "group-3",
                    children: [
                        {
                            name: "Test 13",
                            type: "group-4"
                        }, {
                            name: "Test 14",
                            type: "group-4"
                        }, {
                            name: "Test 15",
                            type: "group-5"
                        }
                    ]
                }, {
                    name: "Test 11",
                    type: "group-3"
                }, {
                    name: "Test 12",
                    type: "group-2"
                }
            ]
        }, {
            name: "Test 4",
            type: "group-1"
        }
    ],
    data2 = [
        {
            name: "Test 1",
            groupName: "group-1",
            children: [
                {
                    name: "Test 5",
                    groupName: "group-1"
                }, {
                    name: "Test 6",
                    groupName: "group-2"
                }, {
                    name: "Test 7",
                    groupName: "group-2"
                }
            ]
        }, {
            name: "Test 2",
            groupName: "group-1",
            children: [
                {
                    name: "Test 8",
                    groupName: "group-3"
                }, {
                    name: "Test 9",
                    groupName: "group-3"
                }, {
                    name: "Test 10",
                    groupName: "group-2"
                }
            ]
        }, {
            name: "Test 3",
            groupName: "group-1"
        }, {
            name: "Test 4",
            groupName: "group-1"
        }
    ];

chai.use(require('chai-string'));
chai.should();

describe('Grouping', function () {
    describe('#grouing-without-config', function () {
        it('all items in array must be grouped', function () {
            testGroup(groupBy(data));
        });
    });
    describe('#grouping-withs-config', function () {
        describe("#groupName-config", function () {
            it('all items in array must be grouped with custom groupName', function () {
                let config = {
                    groupBy: "groupName"
                };
                testGroup(groupBy(data2, config), config);
            });
        });
        describe("#childElement-config", function () {
            it('all items in array must be grouped with custom childElement', function () {
                let config = {
                    childElement: "children"
                };
                testGroup(groupBy(data, config), config);
            });
        });
        describe("#prefix-config", function () {
            it('all items in array must be grouped with prefix added to groupItem', function () {
                let config = {
                    prefix: "_"
                };
                testPrefix(groupBy(data, config), config);
            });
        });
        describe("#prefix-generateId", function () {
            it('all group headers in array should have unique id', function () {
                let config = {
                    generateId: true
                };
                testGeneratedId(groupBy(data, config), config);
            });
        });
    });
});

const defaults = {
    aliases: [],
    groupBy: "type",
    childElement: "children",
    prefix: "",
    generateId: true
};

let generatedIdList = [];
const testGeneratedId = (array, options = {}) => {
    let config = Object.assign({}, defaults, options);

    array.forEach(element => {
        if (element[config.childElement] && element[config.childElement].length > 0) {
            testGeneratedId(element[config.childElement], options);
        }

        if (element.groupItem) {
            let result = generatedIdList.find(g => g === element.id) === undefined;
            result.should.be.true;

            if(result){
                generatedIdList.push(element.id);
            }
        }
    });
}

const testGroup = (array, options = {}) => {
    let config = Object.assign({}, defaults, options);

    array.forEach(element => {
        if (element[config.childElement] && element[config.childElement].length > 0) {
            testGroup(element[config.childElement], options);

            let groupName = element[config.childElement][0][config.groupBy];
            let result = (groupName, element[config.childElement].filter(child => child[config.groupBy] != groupName && child.groupItem != true).length > 0);
            result
                .should
                .equal(false);
        }
    });
}

const testPrefix = (array, options = {}) => {
    let config = Object.assign({}, defaults, options);

    array.forEach(element => {
        if (element.groupItem) {
            element[config.groupBy]
                .startsWith(config.prefix)
                .should
                .be
                .true;

            if (element[config.childElement] && element[config.childElement].length > 0) {
                testPrefix(element[config.childElement], options);
            }
        }
    });
}