<?php

namespace Stackfactory\SfSeolighthouse\Widgets;

use TYPO3\CMS\Dashboard\Widgets\AdditionalCssInterface;
use TYPO3\CMS\Dashboard\Widgets\ButtonProviderInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetConfigurationInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetInterface;
use TYPO3\CMS\Fluid\View\StandaloneView;

class SeoWidget implements WidgetInterface, RequestAwareWidgetInterface
 {
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
 
         if (!($this->options['titleField'] ?? false)) {
             $this->options['titleField'] = $GLOBALS['TCA'][$recordTable]['ctrl']['label'] ?? '';
         }
 
         $this->view->setTemplate('Widget/ListOfRecordsWidget');
         $this->view->assignMultiple([
             'configuration' => $this->configuration,
             'records' => $this->dataProvider->getItems(),
             'table' => $recordTable,
             'button' => $this->buttonProvider,
             'options' => $this->options
         ]);
 
         return $this->view->render();
     }

     public function getCssFiles(): array
     {
         return ['EXT:sf_seolighhouse/Resources/Public/Stylesheet/widgets.css'];
     }
 
     public function getOptions(): array
     {
         return $this->options;
     }
}