(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[444],{1969:function(e,t,i){Promise.resolve().then(i.bind(i,706))},8257:function(e,t,i){"use strict";i.d(t,{Fx:function(){return d},RE:function(){return u},cn:function(){return c},lB:function(){return l}});var n=i(4194);class s{constructor(){this._name="spending",this.city=new n.TableField("spending.city"),this.country=new n.TableField("spending.country"),this.continent=new n.TableField("spending.continent"),this.spendingCategory=new n.TableField("spending.spending category"),this.spendingSubcategory=new n.TableField("spending.spending subcategory"),this.year=new n.TableField("spending.year"),this.amount=new n.TableField("spending.amount"),this._fields=[this.city,this.country,this.continent,this.spendingCategory,this.spendingSubcategory,this.year,this.amount]}}class a{constructor(){this._name="portfolio",this.ticker=new n.TableField("portfolio.Ticker"),this.dateScenario=new n.TableField("portfolio.DateScenario"),this.currency=new n.TableField("portfolio.Currency"),this.nbShares=new n.TableField("portfolio.NbShares"),this.portfolio=new n.TableField("portfolio.Portfolio"),this.riskType=new n.TableField("portfolio.RiskType"),this.scenarioValue=new n.TableField("portfolio.ScenarioValue"),this._fields=[this.ticker,this.dateScenario,this.currency,this.nbShares,this.portfolio,this.riskType,this.scenarioValue]}}class o{constructor(){this._name="population",this.country=new n.TableField("population.country"),this.continent=new n.TableField("population.continent"),this.population=new n.TableField("population.population"),this._fields=[this.country,this.continent,this.population]}}class r{constructor(){this._name="budget",this.incomeExpenditure=new n.TableField("budget.Income / Expenditure"),this.category=new n.TableField("budget.Category"),this.subcategory=new n.TableField("budget.Subcategory"),this.year=new n.TableField("budget.Year"),this.month=new n.TableField("budget.Month"),this.day=new n.TableField("budget.Day"),this.date=new n.TableField("budget.Date"),this.description=new n.TableField("budget.Description"),this.amount=new n.TableField("budget.Amount"),this.happinessScore=new n.TableField("budget.Happiness score"),this.scenario=new n.TableField("budget.Scenario"),this._fields=[this.incomeExpenditure,this.category,this.subcategory,this.year,this.month,this.day,this.date,this.description,this.amount,this.happinessScore,this.scenario]}}let l=new s,c=new a,u=new o,d=new r},706:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return f}});var n=i(3827),s=i(4194),a=i(8257),o=i(8408),r=i(8899),l=i(1857);let c=new s.ParametrizedMeasure("VaR 95","VAR",{value:a.cn.scenarioValue,date:a.cn.dateScenario,quantile:.95,return:"value"}),u=new s.ParametrizedMeasure("VaR 95 - Date","VAR",{value:a.cn.scenarioValue,date:a.cn.dateScenario,quantile:.95,return:"date"}),d=new s.ParametrizedMeasure("Incr. VaR 95","INCREMENTAL_VAR",{value:a.cn.scenarioValue,date:a.cn.dateScenario,quantile:.95,axis:s.Axis.COLUMN}),h=(0,s.sum)("PnL",a.cn.scenarioValue);class b{query(e,t,i,n){return(0,s.from)(a.cn._name).where((0,o.T1)(i)).select(e,[],t).build()}constructor(){this.selectableFields=a.cn._fields,this.measures=[s.countRows,h,c,u,d],this.formatters=[new r.c9(u.alias,l.an)],this.table=[a.cn]}}var p=i(5151),w=i(4232);let g=new b,y=(0,w.default)(()=>Promise.all([i.e(891),i.e(231)]).then(i.bind(i,2891)),{loadableGenerated:{webpack:()=>[2891]},ssr:!1});function f(){return(0,n.jsx)(y,{title:"Portfolio",queryProvider:g,elements:[(0,n.jsx)(p.Z,{table:"portfolio"},"uf")]})}}},function(e){e.O(0,[798,908,716,971,69,744],function(){return e(e.s=1969)}),_N_E=e.O()}]);