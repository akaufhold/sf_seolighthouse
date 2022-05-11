<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Widgets;

use TYPO3\CMS\Dashboard\Widgets\AdditionalCssInterface;
use TYPO3\CMS\Dashboard\Widgets\ButtonProviderInterface;
use TYPO3\CMS\Dashboard\Widgets\RequireJsModuleInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetConfigurationInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetInterface;
use TYPO3\CMS\Fluid\View\StandaloneView;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use \TYPO3\CMS\Backend\Utility\BackendUtility;
use Stackfactory\SfSeolighthouse\Controller;
class ListOfRecordsWidget implements WidgetInterface, RequireJsModuleInterface, AdditionalCssInterface
 {
    /**
     * @var WidgetConfigurationInterface
     */
    private $configuration;

    /** 
     * @var ListOfRecordsDataProviderInterface 
     */
    private $dataProvider;

    /**
     * @var StandaloneView
     */
    private $view;

    /** 
     * @var ButtonProviderInterface|null 
     */
    private $buttonProvider;

    /**
     * @var array
     */
    private $options;

    private ServerRequestInterface $request;

    public function __construct(
        WidgetConfigurationInterface $configuration,
        ListOfRecordsDataProviderInterface $dataProvider,
        StandaloneView $view,
        $buttonProvider = null,
        array $options = []
    ) {
        $this->configuration = $configuration;
        $this->dataProvider = $dataProvider;
        $this->view = $view;
        $this->buttonProvider = $buttonProvider;
        $this->options = $options;
    }

    public function setRequest(ServerRequestInterface $request): void
    {
        $this->request = $request;
    }

    public function renderWidgetContent(): string
    {
        $recordTable = $this->dataProvider->getTable();
        $LighthouseStatisticsController = GeneralUtility::makeInstance(\Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController::class);
        $baseUrl = $LighthouseStatisticsController->getBaseUrl();
        //$slug = BackendUtility::getPreviewUrl($this->dataProvider->getItems("target"));

        $slug = $this->dataProvider->getItems("target");

        //DebugUtility::debug($LighthouseStatisticsController->getBaseUrl());

        if (!($this->options['titleField'] ?? false)) {
            $this->options['titleField'] = $GLOBALS['TCA'][$recordTable]['ctrl']['label'] ?? '';
        }

        /*BackendUtility::getPreviewUrl($pid)*/
        

        $this->view->setTemplate('Widget/List');
        $this->view->assignMultiple([
            'configuration' => $this->configuration,
            'records' => $this->dataProvider->getItems(),
            'table' => $recordTable,
            'slug' => $slug[0],
            'button' => $this->buttonProvider,
            'options' => $this->options
        ]);

        return $this->view->render();
    }

    public function getCssFiles(): array
    {
        return ['EXT:sf_seolighthouse/Resources/Public/StyleSheet/widget.css'];
        
    }
 
    public function getRequireJsModules(): array
    {
        return [
            'TYPO3/CMS/Stackfactory/SfSeolighthouse/Widgets/Widget',
        ];
    }

    public function getOptions(): array
    {
        return $this->options;
    }
}