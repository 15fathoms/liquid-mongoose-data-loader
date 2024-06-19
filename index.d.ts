declare module 'liquid-mongoose-data-loader' {
    import { Liquid } from 'liquidjs';
  
    interface Options {
      modelsPath: string;
    }
  
    function DataLoader(engine: Liquid, options: Options): void;
  
    export = DataLoader;
  }
  