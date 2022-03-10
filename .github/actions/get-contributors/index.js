const core = require("@actions/core");
const project_name = core.getInput("project_name");
const issue_title = core.getInput("issue_title");
import fetch from 'node-fetch';

const ReposMap = {
    "tdesign-vue": {
        type: 'isComponent',
        device: 'web',
    },
    "tdesign-vue-next": {
        type: 'isComponent',
        device: 'web',
    },
    "tdesign-react": {
        type: 'isComponent',
        device: 'web',
    },
    "tdesign-mobile-vue": {
        type: 'isComponent',
        device: 'mobile',
    },
    "tdesign-miniprogram": {
        type: 'isComponent',
        device: 'miniprogram',
    },
    "tdesign": {
        type: 'isDefault',
        owner: ['94dreamer']
    },
    "tdesign-common": {
        type: 'isDefault',
        owner: ['xiaosansiji']
    },
    "tdesign-starter-cli": {
        type: 'isDefault',
        owner: ['uyarn']
    },
    "tdesign-vue-starter": {
        type: 'isDefault',
        owner: ['uyarn']
    },
    "tdesign-vue-next-starter": {
        type: 'isDefault',
        owner: ['pengYYYYY']
    },
    "tdesign-react-starter": {
        type: 'isDefault',
        owner: ['xucz']
    },
    "tdesign-icons": {
        type: 'isDefault',
        owner: ['uyarn']
    },
}

const getContributorsFromWuji = async (device) => {
    return fetch('https://v.qq.com/cache/wuji_public/object?appid=_xy_tdesign&schemaid=contributor&schemakey=5d5bd1cc53f3489b90e7f0280c00368b').then(reponse => {
        return reponse.json();
    }).then(res => {
        return JSON.parse(res.data.find(n => n.project === device).data);
    }).catch(res => {
        console.log('没有找到' + device + '在wuji')
        return null
    })
}

const generatorContributors = async (project_name, issue_title) => {
    if (ReposMap[project_name].type === 'isComponent') {
        const { device } = ReposMap[project_name];
        const data = await getContributorsFromWuji(device);

        let component = issue_title.match(/\[(\w+)\]/i);
        if (!component) return [];

        component = component[1].toLocaleLowerCase();

        let componentData = data.find(n => n.name === component);
        if (!componentData) return [];

        const taskName = project_name.replace('tdesign-', '').replace('mobile-', '').replace('miniprogram', 'wx');

        componentData = componentData.tasks.find(n => n.name === taskName)
        if (!componentData) return [];

        return componentData.contributors;
    } else if (ReposMap[project_name].type === 'isDefault') {
        return ReposMap[project_name].owner;
    }

    return ReposMap[project_name].owner
}


generatorContributors(project_name, issue_title).then(data => {
    console.log(data);
    core.setOutput("contributors", data.join(','));
}).catch(err => {
    core.setFailed("contributors", err);
})









