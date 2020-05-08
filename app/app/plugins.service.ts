import {Injectable, NgModuleFactory, Type} from '@angular/core';
import {PluginsProvider} from './plugins.provider';

import * as core from '@angular/core';
import * as common from '@angular/common';
import * as forms from '@angular/forms';
import * as router from '@angular/router';
import * as rxjs from 'rxjs';
import * as tslib from 'tslib';

const PLUGIN_EXTERNALS_MAP = {
  'ng.core': core,
  'ng.common': common,
  'ng.forms': forms,
  'ng.router': router,
  rxjs,
  tslib
};

const SystemJs = (window as any).System;

@Injectable()
export class PluginsService {
  constructor(private configProvider: PluginsProvider) {
    Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
        (window as any).define(
            externalKey,
            [],
            () => PLUGIN_EXTERNALS_MAP[externalKey]
        )
    );
  }

  load<T>(pluginName): Promise<Type<T>> {
    const { config } = this.configProvider;
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }

    const depsPromises = (config[pluginName].deps || []).map(dep => {
      return SystemJs.import(config[dep].path).then(m => {
        window['define'](dep, [], () => m.default);
      });
    });

    return Promise.all(depsPromises).then(() => {
      return SystemJs.import(config[pluginName].path).then(
          module => module.default.default
      );
    });
  }
}
