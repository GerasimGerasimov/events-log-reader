const events: string = `
0=FAULT/a/0/Аварийное отключение/Отключение по причине: см. осциллограмму/
1=GlobalError/a/0/Внешняя ошибка//
2=FieldFail/a/0/Обрыв поля/Отключение по причине: Ток ротора ниже минимальной уставки свыше допустимого времени/
3=UstMaxFlt/a/0/Максимальное напряжение статора/Отключение по причине: Превышение максимального напряжения статора/
4=IttMaxFlt/a/0/Макс. ток выпрямителя/Отключение по причине: Ток выпрямителя превысил уставку максимального тока/
5=IexcMaxFlt/a/0/Макс. ток нагрузки/Отключение по причине: Ток нагрузки превысил уставку максимального тока/
6=FltMPS/a/0/Отключился силовой выключатель/Отключение по причине: Отключение силового выключателя во время работы возбудителя/
7=FSAsyncRun/a/0/Асинхронный ход по датчику наведённого напряжения/Отключение по причине: Допустимое время асинхронного хода превышено/
8=FLongForce/a/0/Превышение времени форсировки/Отключение по причине: Допустимое время форсировки превышено/
9=FltCCSB/a/0/Отключился выключатель цепей ГЩУ/Отключение по причине: Отключение выключателя цепей питания ГЩУ во время работы возбудителя/
10=FreqMinFlt/a/0/Низкая частота напряжения/Отключение по причине: Минимальная частота напряжения генератора/
11=QminAsyncRun/a/0/Асинхронный ход/Отключение по причине: Асинхронный ход по минимальной реактивной мощности/
12=NotUpVoltage/a/0/Неудачный пуск/Отключение по причине: напряжение не достигло уставки за заданное время/
13=R_INSL_FLT/a/0/Земля в роторе/Отключение по причине: Сопротивление изоляция ротора недопустимо низкое/
14=IstOV/a/0/Макс. ток статора/Отключение по причине: Ток статора превысил уставку максимального тока/
15=F1.NotValidReg/a/0/Нет исправных регуляторов//
16=iSGFault/a/0/Защита генератора/Отключение по причине: получен сигнал "Защита генератора"/
17=PWR/i/0/Выпрямитель включен/На тиристоры выпрямителя поданы импульсы управления/
18=ForceByUst/i/0/Форсировка/Подача тока с форсировкой по причине просадки напряжения статора/
19=iSwState/i/0/Выключатель включен/БК выключателя в состоянии "Включен"/
20=iEnergize/i/0/Возбуждение/Команда "Возбуждение"/
21=iBlanking/i/0/Гашение/Команда "Гашение"/
22=iAuto/i/0/Положение переключателя "РУЧНОЙ/АВТОМАТИЧЕСКИЙ"/
23=F0.DEV_EQU/w/1/Регуляторы не эквивалентны/
`
function loadLinesFromBuffer (buff: string): Array<string> {
  return buff
         .toString()
         .split("\n")
         .map((value) => value.trim())
         .filter(String);
}

function cutEventNubmer (source: string): string{
  const res: Array<string> = source.split('=',2);
  return res[1] || ''
}

export interface IEventDetails {
  type: string;
  initialValue: string;
  comment: string;
  todo: string;
}

export interface IEvent {
  date: string;
  type: string;
  tag: string;
  details: {
    initialValue: string;
    comment: string;
    todo: string;
  }
}

interface IEventSourceParameters extends IEventDetails {
  tag: string;
}


//iEnergize/i/0/Возбуждение/Команда "Возбуждение"/
function getParametersFromString(source: string):  IEventSourceParameters {
  const res: Array<string> = source.split('/');
  const tag = res[0] || '';
  const type = res[1] || '';
  const initialValue = res[2] || '';
  const comment = res[3] || '';
  const todo = res[4] || ''
  const result: IEventSourceParameters = {
    tag,
    type,
    initialValue,
    comment,
    todo
  }
  return result;
}

function fillMapFromBuffer (source: Array<string>): Map<string, IEventDetails> {
  const result: Map<string, IEventDetails> = new Map();
  source.forEach(element => {
    let eventString = cutEventNubmer(element);
    let sourceparameters: IEventSourceParameters = getParametersFromString(eventString);
    const {type, initialValue, comment, todo} = {... sourceparameters};
    let parameters: IEventDetails = {type, initialValue, comment, todo};
    result.set(sourceparameters.tag, parameters)
  });
  return result;
}

const strings = loadLinesFromBuffer(events);
export const EventsMap: Map<string, IEventDetails> = fillMapFromBuffer(strings);
