const path = require('path');
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const inquirer = require('inquirer');
const walkSync = require('walk-sync');

const isCamelized = (name) =>
  /^[A-X][a-z]+([A-Z][a-z]+)*/g.test(name);

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    const continueYo = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the NotBad ${chalk.red('react-new-component')} generator`
    ));

    const prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'Type a name for the new component:',
      validate: (value) => {
        if (!isCamelized(value)) {
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

    this.prompt(prompts, props => {
      this.props = props;
      continueYo();
    });
  },

  writing: function() {
    const {
      componentPath,
      componentName,
      jsExtension,
      stylesheetExtension
    } = this.props;

    const jsFileName = `${componentName}.${jsExtension}`;
    const stylesheetName = `${componentName}.${stylesheetExtension}`;
    const jsFullPath = path.join(componentPath, componentName, jsFileName);
    const stylesheetFullPath = path.join(componentPath, componentName, stylesheetName);
    const indexFullPath = path.join(componentPath, componentName, 'index.js');

    this.fs.copyTpl(
      this.templatePath('componentFile'),
      this.destinationPath(jsFullPath),
      {
        componentName: this.props.componentName,
        propsRequired: this.props.propsRequired,
        stateRequired: this.props.stateRequired,
        needStylesheet: !!this.props.stylesheetExtension,
        stylesheetFile: stylesheetName
      }
    );

    this.fs.copyTpl(
      this.templatePath('componentIndexFile'),
      this.destinationPath(indexFullPath),
      {
        componentName: this.props.componentName
      }
    );

    if (!!this.props.stylesheetExtension) {
      this.fs.copyTpl(
        this.templatePath('stylesheetFile'),
        this.destinationPath(stylesheetFullPath),
        {
          componentName: this.props.componentName
        }
      );
    }
  }
});
