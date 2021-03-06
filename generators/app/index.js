const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const inquirer = require('inquirer');
const walkSync = require('walk-sync');

const isCamelCase = (name) =>
  /^[A-Z][A-Za-z]+$/g.test(name);

module.exports = class extends Generator {
  prompting() {
    const continueYo = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the NotBad ${chalk.red('react-new-component')} generator`
    ));

    const prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'Type a name for the new component:',
      validate: (name) => {
        if (!isCamelCase(name)) {
          this.log(
            chalk.red('\nComponent name should use CamelCase notation! Example: NotBadComponent')
          );
          return false;
        }
        return true;
      }
    }, {
      type: 'list',
      name: 'componentPath',
      message: 'Choose component path:',
      choices: () => {
        const dirs = [];
        const reg = new RegExp('^(client|app|src)/(component|container|view|)(s)?/([a-z|-]*/)*$');
        const entries = walkSync.entries('.', { globs: ['client/**/*', 'app/**/*', 'src/**/*'] });
        entries.forEach(entry => {
          if (entry.isDirectory() && reg.test(entry.relativePath)) {
            dirs.push(entry.relativePath);
          }
        });
        return dirs;
      },
      store: true,
      default: 0
    }, {
      type: 'list',
      name: 'jsExtension',
      message: 'Choose script file extension:',
      choices: ['js', 'jsx'],
      store: true,
      default: 'jsx'
    }, {
      type: 'confirm',
      name: 'propsRequired',
      message: 'Whether to add props?',
      default: true
    }, {
      type: 'confirm',
      name: 'stateRequired',
      message: 'Whether to add a state?',
      default: true
    }, {
      type: 'confirm',
      name: 'specRequired',
      message: 'Init Jest spec file?',
      default: true
    }, {
      type: 'list',
      name: 'stylesheetExtension',
      message: 'Choose stylesheet file extension:',
      choices: [
        {
          name: 'please no stylesheet file!',
          value: false
        },
        new inquirer.Separator(),
        'css',
        'styl',
        'less',
        'scss'
      ],
      store: true,
      default: 'css'
    }];

    this.prompt(prompts).then(props => {
      this.props = props;
      continueYo();
    });
  }

  writing() {
    const {
      componentPath,
      componentName,
      jsExtension,
      specRequired,
      propsRequired,
      stateRequired,
      stylesheetExtension
    } = this.props;

    const jsFileName = `${componentName}.${jsExtension}`;
    const stylesheetName = `${componentName}.${stylesheetExtension}`;
    const specFileName = `${componentName}.spec.${jsExtension}`;
    const jsFullPath = path.join(componentPath, componentName, jsFileName);
    const stylesheetFullPath = path.join(componentPath, componentName, stylesheetName);
    const indexFullPath = path.join(componentPath, componentName, 'index.js');
    const specFullPath = path.join(componentPath, `${componentName}/__tests__/`, specFileName);

    this.fs.copyTpl(
      this.templatePath('componentFile'),
      this.destinationPath(jsFullPath),
      {
        componentName: componentName,
        propsRequired: propsRequired,
        stateRequired: stateRequired,
        needStylesheet: !!stylesheetExtension,
        stylesheetFile: stylesheetName
      }
    );

    specRequired &&
      this.fs.copyTpl(
        this.templatePath('specFile'),
        this.destinationPath(specFullPath),
        {
          componentName: componentName
        }
      );

    this.fs.copyTpl(
      this.templatePath('componentIndexFile'),
      this.destinationPath(indexFullPath),
      {
        componentName: componentName
      }
    );

    stylesheetExtension &&
      this.fs.copyTpl(
        this.templatePath('stylesheetFile'),
        this.destinationPath(stylesheetFullPath),
        {
          componentName: componentName
        }
      );
  }
};
