import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ConclusionData {
  id: string;
  jointNumber: string;
  inspectorName: string;
  date: string;
  controlType: string;
  results: string;
  notes: string;
  status: 'draft' | 'completed';
  createdAt: Date;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('create');
  const [drafts, setDrafts] = useState<ConclusionData[]>([]);
  const [history, setHistory] = useState<ConclusionData[]>([]);
  const [formData, setFormData] = useState<Omit<ConclusionData, 'id' | 'createdAt'>>({
    jointNumber: '',
    inspectorName: '',
    date: new Date().toISOString().split('T')[0],
    controlType: '',
    results: '',
    notes: '',
    status: 'draft'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    const draft: ConclusionData = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setDrafts(prev => [...prev, draft]);
    toast.success('Черновик сохранён');
  };

  const generateDocument = () => {
    const conclusion: ConclusionData = {
      ...formData,
      id: Date.now().toString(),
      status: 'completed',
      createdAt: new Date()
    };
    setHistory(prev => [...prev, conclusion]);
    toast.success('Заключение создано и готово к скачиванию');
    
    setFormData({
      jointNumber: '',
      inspectorName: '',
      date: new Date().toISOString().split('T')[0],
      controlType: '',
      results: '',
      notes: '',
      status: 'draft'
    });
  };

  const loadDraft = (draft: ConclusionData) => {
    setFormData({
      jointNumber: draft.jointNumber,
      inspectorName: draft.inspectorName,
      date: draft.date,
      controlType: draft.controlType,
      results: draft.results,
      notes: draft.notes,
      status: 'draft'
    });
    setActiveSection('create');
    toast.info('Черновик загружен');
  };

  const stats = {
    totalDocuments: history.length,
    draftsCount: drafts.length,
    thisMonth: history.filter(h => {
      const date = new Date(h.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                НК Заключения
              </h1>
              <p className="text-muted-foreground mt-2">Система генерации заключений по неразрушающему контролю</p>
            </div>
            <div className="flex gap-4">
              <Card className="bg-card/50 backdrop-blur border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{stats.totalDocuments}</div>
                  <div className="text-sm text-muted-foreground">Всего документов</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur border-secondary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">За этот месяц</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </header>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur p-1">
            <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="FilePlus" size={16} className="mr-2" />
              Создать
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="FileText" size={16} className="mr-2" />
              Шаблоны
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="History" size={16} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Save" size={16} className="mr-2" />
              Черновики ({drafts.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="FileEdit" size={24} className="text-primary" />
                  Новое заключение НК
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jointNumber">Номер стыка</Label>
                    <Input
                      id="jointNumber"
                      placeholder="Введите номер стыка"
                      value={formData.jointNumber}
                      onChange={(e) => handleInputChange('jointNumber', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspectorName">ФИО дефектоскописта</Label>
                    <Input
                      id="inspectorName"
                      placeholder="Иванов Иван Иванович"
                      value={formData.inspectorName}
                      onChange={(e) => handleInputChange('inspectorName', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата контроля</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="controlType">Тип контроля</Label>
                    <Select value={formData.controlType} onValueChange={(value) => handleInputChange('controlType', value)}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Выберите тип контроля" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ut">Ультразвуковой (УЗК)</SelectItem>
                        <SelectItem value="rt">Радиографический (РК)</SelectItem>
                        <SelectItem value="mt">Магнитопорошковый (МПК)</SelectItem>
                        <SelectItem value="pt">Капиллярный (ПВК)</SelectItem>
                        <SelectItem value="vt">Визуальный (ВИК)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Результаты контроля</Label>
                  <Textarea
                    id="results"
                    placeholder="Опишите результаты проведённого контроля..."
                    value={formData.results}
                    onChange={(e) => handleInputChange('results', e.target.value)}
                    className="min-h-32 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Дополнительные примечания</Label>
                  <Textarea
                    id="notes"
                    placeholder="Дополнительная информация, замечания..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-24 bg-background/50"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={generateDocument}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
                    size="lg"
                  >
                    <Icon name="Download" size={20} className="mr-2" />
                    Сгенерировать документ
                  </Button>
                  <Button
                    onClick={saveDraft}
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10"
                    size="lg"
                  >
                    <Icon name="Save" size={20} className="mr-2" />
                    Сохранить черновик
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="FileStack" size={24} className="text-secondary" />
                  Управление шаблонами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Загрузите шаблон DOCX</h3>
                  <p className="text-muted-foreground mb-6">Загрузите файл шаблона в формате Base64 или DOCX</p>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Upload" size={20} className="mr-2" />
                    Загрузить шаблон
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Clock" size={24} className="text-primary" />
                  История заключений
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="FileX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Пока нет созданных заключений</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">Стык №{item.jointNumber}</h4>
                            <p className="text-sm text-muted-foreground">{item.inspectorName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.createdAt).toLocaleDateString('ru-RU')} • {item.controlType}
                            </p>
                          </div>
                          <Button size="sm" className="bg-primary">
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="FileEdit" size={24} className="text-secondary" />
                  Сохранённые черновики
                </CardTitle>
              </CardHeader>
              <CardContent>
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Нет сохранённых черновиков</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="p-4 rounded-lg bg-background/50 border border-secondary/20 hover:border-secondary/40 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">Стык №{draft.jointNumber || 'Не указан'}</h4>
                            <p className="text-sm text-muted-foreground">{draft.inspectorName || 'Не указан'}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Сохранён: {new Date(draft.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => loadDraft(draft)} className="bg-secondary">
                            <Icon name="Edit" size={16} className="mr-2" />
                            Продолжить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Settings" size={24} className="text-primary" />
                  Настройки и интеграции
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Облачные сервисы</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Icon name="Cloud" size={24} className="mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">Google Drive</div>
                        <div className="text-xs text-muted-foreground">Не подключен</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Icon name="Cloud" size={24} className="mr-3 text-secondary" />
                      <div className="text-left">
                        <div className="font-semibold">Dropbox</div>
                        <div className="text-xs text-muted-foreground">Не подключен</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="UserCircle" size={24} className="text-secondary" />
                  Профиль дефектоскописта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>ФИО</Label>
                    <Input placeholder="Введите полное имя" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Должность</Label>
                    <Input placeholder="Дефектоскопист II уровня" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Номер аттестата</Label>
                    <Input placeholder="№ аттестата" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Организация</Label>
                    <Input placeholder="Название организации" className="bg-background/50" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить профиль
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
